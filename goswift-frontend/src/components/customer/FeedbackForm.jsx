import { useState } from "react";
import customerService from "../../services/customer.service";

const FeedbackForm = ({ booking, onClose, onSubmit }) => {
  const [feedback, setFeedback] = useState({
    rating: 5,
    comments: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await customerService.addFeedback({
        bookingId: booking.bookingId,
        rating: feedback.rating,
        comments: feedback.comments
      });
      
      alert("Thank you for your feedback!");
      onSubmit();
      onClose();
    } catch (error) {
      alert("Failed to submit feedback: " + (error.response?.data?.message || "Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'white', padding: '30px', borderRadius: '8px',
        maxWidth: '500px', width: '90%'
      }}>
        <h3>Rate Your Journey</h3>
        <p><strong>Route:</strong> {booking.schedule?.sourceCity?.cityName} → {booking.schedule?.destCity?.cityName}</p>
        <p><strong>Date:</strong> {booking.journeyDate}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rating (1-5 stars)</label>
            <select 
              className="form-control" 
              value={feedback.rating}
              onChange={(e) => setFeedback({...feedback, rating: parseInt(e.target.value)})}
              required
            >
              <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
              <option value={4}>⭐⭐⭐⭐ Good</option>
              <option value={3}>⭐⭐⭐ Average</option>
              <option value={2}>⭐⭐ Poor</option>
              <option value={1}>⭐ Very Poor</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Comments (Optional)</label>
            <textarea 
              className="form-control" 
              rows="4"
              placeholder="Share your experience..."
              value={feedback.comments}
              onChange={(e) => setFeedback({...feedback, comments: e.target.value})}
            />
          </div>
          
          <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;