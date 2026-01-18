import { Router } from 'express';
import { getUser, getListForCreatingGroups, getPeoplesListForCreatingChats, getChatsList, getGroupsList, getMessages } from '../controllers/api.controller.js'
import { authenticate } from '../controllers/auth.controller.js';

const router = Router();

router.post('/getUser', authenticate, getUser);
router.post('/getConvosList', authenticate, getListForCreatingGroups);
router.post('/getPeoplesList', authenticate, getPeoplesListForCreatingChats);
router.post('/getChatsList', authenticate, getChatsList);
router.post('/getGroupsList', authenticate, getGroupsList);
router.post('/getMessages', authenticate, getMessages);

export default router;