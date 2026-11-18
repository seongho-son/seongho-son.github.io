import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch, Mock


class PublisherTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        root = Path(self.tmp.name)
        (root / 'manifest.json').write_text('[]')
        spec = importlib.util.spec_from_file_location('ig_publish_test', Path(__file__).parents[1] / 'scripts/instagram/publish.py')
        self.ig = importlib.util.module_from_spec(spec)
        with patch.dict(os.environ, INSTAGRAM_DIR=str(root)):
            spec.loader.exec_module(self.ig)
        self.ig.shot = Mock()
        self.addCleanup(self.tmp.cleanup)

    def test_native_input_keeps_blank_lines(self):
        self.ig.call = Mock()
        self.ig.ev = Mock(side_effect=['', 'first\n\nlast', json.dumps({'root': {'type':'root','children':[{'text':'first\n\nlast'}]}}), ''])
        self.ig.paste_caption('first\n\nlast')
        self.assertEqual(self.ig.call.call_args_list, [
            unittest.mock.call('keypress', '--key', 'Backspace'),
            unittest.mock.call('inserttext', '--text', 'first'),
            unittest.mock.call('keypress', '--key', 'Enter'),
            unittest.mock.call('keypress', '--key', 'Enter'),
            unittest.mock.call('inserttext', '--text', 'last'),
        ])

    def test_reconcile_repairs_existing_posts_only(self):
        pending = {'status': 'published_pending_verification', 'slug': 'a', 'url': 'https://www.instagram.com/p/a/'}
        self.ig.manifest = [pending, {'status': 'prepared_not_published'}, {'status': 'published_verified'}]
        self.ig.verify_entry = Mock()
        self.ig.reconcile()
        self.ig.verify_entry.assert_called_once_with(pending)

    def test_ambiguous_submission_blocks_new_posts(self):
        self.ig.manifest = [{'status': 'publish_submitted', 'slug': 'a'}]
        with self.assertRaisesRegex(RuntimeError, 'before retry'):
            self.ig.reconcile()

    def test_failed_caption_does_not_mark_verified(self):
        cap = Path(self.tmp.name) / 'caption.txt'
        cap.write_text('expected')
        entry = {'status': 'published_pending_verification', 'slug': 'a', 'caption': str(cap)}
        self.ig.open_post = Mock()
        self.ig.saved_caption = Mock(return_value=False)
        self.ig.ev = Mock(return_value='false')
        self.ig.wait = Mock()
        self.ig.click = Mock()
        self.ig.caption = Mock()
        self.ig.save = Mock()
        with self.assertRaisesRegex(RuntimeError, 'Caption not saved'):
            self.ig.verify_entry(entry)
        self.assertEqual(entry['status'], 'published_pending_verification')
        self.ig.save.assert_not_called()
        self.assertEqual(self.ig.open_post.call_count, 2)

    def test_recovery_keeps_original_publication_date(self):
        cap = Path(self.tmp.name) / 'caption.txt'
        cap.write_text('expected')
        entry = {'status': 'published_pending_verification', 'slug': 'a',
                 'caption': str(cap), 'slide_count': 2, 'url': 'https://www.instagram.com/p/a/',
                 'submitted_at': '2026-11-04T06:00:00+00:00'}
        self.ig.open_post = Mock()
        self.ig.saved_caption = Mock(return_value=True)
        self.ig.call = Mock()
        self.ig.ev = Mock(side_effect=['', 'https://www.instagram.com/p/a/?img_index=2', 'false'])
        self.ig.save = Mock()
        with patch.object(self.ig.time, 'sleep'):
            self.ig.verify_entry(entry)
        self.assertEqual(entry['published_at'], entry['submitted_at'])
        self.assertEqual(entry['status'], 'published_verified')
        self.assertEqual(entry['published_slide_count_verified'], 2)
        self.ig.save.assert_called_once()

    def test_dom_only_caption_is_rejected(self):
        self.ig.call = Mock()
        self.ig.ev = Mock(side_effect=['', 'caption', json.dumps({'root': {'children': []}})])
        with self.assertRaisesRegex(RuntimeError, 'not synchronized'):
            self.ig.paste_caption('caption')

    def test_workspace_does_not_reuse_foreign_tab(self):
        self.ig.target_workspace = Mock(return_value='folder:ours')
        self.ig.list_tabs = Mock(return_value=[
            {'worktreeId':'folder:other','browserPageId':'foreign','url':'https://www.instagram.com/'},
            {'worktreeId':'folder:ours','browserPageId':'ours','url':'https://www.instagram.com/'}])
        self.assertEqual(self.ig.find_page(),'ours')

    def test_save_uses_browser_click(self):
        self.ig.call = Mock(side_effect=[{'refs': {'e7': {'role': 'button', 'name': '완료'}}}, {}])
        self.ig.click('완료')
        self.assertEqual(self.ig.call.call_args_list[-1], unittest.mock.call('click','--element','@e7'))

if __name__ == '__main__':
    unittest.main()
