import express from 'express';
import {
  createAppointment,
  getMyAppointments,
  getProviderAppointments,
  updateAppointmentStatus,
  holdSlot,
  confirmBooking,
  getQueueStatus,
  deleteAppointment
} from '../controllers/appointmentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { checkBookingSpam } from '../middlewares/spamCheck.js';

const router = express.Router();

router.post('/', protect, checkBookingSpam, createAppointment);
router.post('/hold', protect, checkBookingSpam, holdSlot);
router.put('/:id/confirm', protect, confirmBooking);
router.get('/:id/queue', protect, getQueueStatus);
router.get('/my', protect, getMyAppointments);
router.delete('/:id', protect, deleteAppointment);
router.get('/provider', protect, authorize('organiser', 'admin'), getProviderAppointments);
router.put('/:id/status', protect, authorize('organiser', 'admin'), updateAppointmentStatus);

export default router;
