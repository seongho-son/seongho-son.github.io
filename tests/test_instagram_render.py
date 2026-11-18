import importlib.util
from pathlib import Path
import tempfile
import unittest
from unittest.mock import Mock
from playwright.sync_api import TimeoutError
spec=importlib.util.spec_from_file_location('render',Path(__file__).parents[1]/'scripts/instagram/render_cards.py')
r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)
class RenderTests(unittest.TestCase):
    def test_timeout_retry_preserves_complete_output(self):
        with tempfile.TemporaryDirectory() as d:
            page=Mock();calls=[]
            def capture(**kwargs):
                calls.append(kwargs)
                if len(calls)==1:raise TimeoutError('test')
                Path(kwargs['path']).write_bytes(b'new')
            page.screenshot.side_effect=capture
            r.capture_cards(page,d,2)
            self.assertEqual(len(calls),3)
            self.assertEqual((Path(d)/'02.png').read_bytes(),b'new')
            self.assertEqual(list(Path(d).glob('*.pending.png')),[])
    def test_failed_second_card_keeps_old_set(self):
        with tempfile.TemporaryDirectory() as d:
            for name in ['01.png','02.png']:(Path(d)/name).write_bytes(b'old')
            page=Mock()
            def capture(**kwargs):
                if '02.pending' in kwargs['path']:raise TimeoutError('test')
                Path(kwargs['path']).write_bytes(b'new')
            page.screenshot.side_effect=capture
            with self.assertRaises(TimeoutError):r.capture_cards(page,d,2)
            self.assertEqual((Path(d)/'01.png').read_bytes(),b'old')
            self.assertEqual(list(Path(d).glob('*.pending.png')),[])
