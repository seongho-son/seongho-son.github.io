import importlib.util,json,tempfile,unittest,csv
from datetime import date,timedelta
from pathlib import Path
spec=importlib.util.spec_from_file_location('growth',Path(__file__).parents[1]/'scripts/instagram/growth.py');g=importlib.util.module_from_spec(spec);spec.loader.exec_module(g)
class GrowthTest(unittest.TestCase):
 def test_trial_seven_posts_and_daily_after(self):
  start=date.fromisoformat(g.PLAN['start_date'])
  self.assertEqual([i for i in range(14) if g.due(start+timedelta(days=i),[])],[0,2,4,6,8,10,12])
  self.assertTrue(g.due(start+timedelta(days=14),[]))
 def test_seoul_same_day_blocks_duplicate(self):
  self.assertFalse(g.due(date(2026,10,31),[{'published_at':'2026-10-30T16:00:00+00:00'}]))
 def test_report_preserves_measurements_and_unknowns(self):
  with tempfile.TemporaryDirectory() as d:
   root=Path(d);m=[{'slug':'test','published_at':'2026-10-31T06:00:00+00:00','url':'https://example.com','concept':'yellow'}]
   g.report(root,m)
   with (root/'growth-metrics.csv').open() as f:rows=list(csv.DictReader(f))
   self.assertEqual(rows[0]['reach'],'');rows[0].update(reach='100',saves='10',profile_visits='0',follows='0',notes='keep')
   with (root/'growth-metrics.csv').open('w') as f:w=csv.DictWriter(f,fieldnames=g.FIELDS);w.writeheader();w.writerows(rows)
   g.report(root,m)
   with (root/'growth-metrics.csv').open() as f:row=next(csv.DictReader(f))
   self.assertEqual(row['notes'],'keep');self.assertEqual(row['save_rate'],'0.1000');self.assertEqual(row['share_rate'],'');self.assertEqual(row['follow_per_profile_visit'],'')
if __name__=='__main__':unittest.main()
