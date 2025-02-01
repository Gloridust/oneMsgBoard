import { withAuth } from '@/lib/api-middleware';

export default withAuth(async (req, res) => {
  // 由于使用了withAuth中间件，req.user已经包含了当前用户信息
  return res.status(200).json(req.user);
}, {
  methods: ['GET'],
}); 
