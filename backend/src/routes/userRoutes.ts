import { Router, Request, Response } from 'express';
import { dataService } from '../services/dataService';

const router = Router();

router.get('/search', (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  const exclude = req.query.exclude as string | undefined;

  if (query.length < 2) {
    return res.json({ success: true, users: [] });
  }

  const users = dataService.searchUsers(query, exclude);
  res.json({ success: true, users });
});

export default router;
