// import { useState, useEffect } from "react";
// import { useAuth } from "../../providers/AuthProvider";
// import api from "../../services/api";

// const Profile = () => {
//   const { user } = useAuth();
//   const [profile, setProfile] = useState({ firstName: "", lastName: "", phoneNumber: "", email: "" });
//   const [msg, setMsg] = useState("");

//   useEffect(() => {
//     if(user) {
//         // Fetch fresh profile data
//         api.get(`/users/${user.userId}`).then(res => setProfile(res.data.data));
//     }
//   }, [user]);

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//         await api.put(`/users/${user.userId}`, profile);
//         setMsg("Profile Updated Successfully!");
//     } catch(err) {
//         setMsg("Update Failed");
//     }
//   };

//   return (
//     <div className="container" style={{ marginTop: "20px", marginBottom: "40px" }}>
//       <div style={{ textAlign: "center", marginBottom: "30px" }}>
//         <h2 style={{ color: "#007bff", fontWeight: "600" }}>My Profile</h2>
//         <p style={{ color: "#6c757d" }}>Update your personal information</p>
//       </div>
      
//       <div className="row justify-content-center">
//         <div className="col-md-8 col-lg-6">
//           <div className="card" style={{ borderRadius: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", padding: "30px" }}>
//             {msg && (
//               <div 
//                 className="alert" 
//                 style={{ 
//                   backgroundColor: msg.includes('Successfully') ? "#d4edda" : "#f8d7da",
//                   color: msg.includes('Successfully') ? "#155724" : "#721c24",
//                   border: "none",
//                   borderRadius: "10px",
//                   padding: "12px 20px",
//                   marginBottom: "20px"
//                 }}
//               >
//                 {msg}
//               </div>
//             )}
            
//             <form onSubmit={handleUpdate}>
//               <div className="form-group" style={{ marginBottom: "20px" }}>
//                 <label style={{ fontWeight: "500", color: "#495057", marginBottom: "8px", display: "block" }}>Email (Cannot Change)</label>
//                 <input 
//                   type="email" 
//                   className="form-control" 
//                   value={profile.email} 
//                   disabled 
//                   style={{ 
//                     backgroundColor: "#f8f9fa", 
//                     borderRadius: "8px", 
//                     border: "2px solid #dee2e6",
//                     padding: "12px 15px",
//                     fontSize: "14px"
//                   }}
//                 />
//               </div>
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
//                 <div className="form-group">
//                   <label style={{ fontWeight: "500", color: "#495057", marginBottom: "8px", display: "block" }}>First Name</label>
//                   <input 
//                     type="text" 
//                     className="form-control" 
//                     value={profile.firstName} 
//                     onChange={e => setProfile({...profile, firstName: e.target.value})} 
//                     required
//                     style={{ 
//                       borderRadius: "8px", 
//                       border: "2px solid #dee2e6",
//                       padding: "12px 15px",
//                       fontSize: "14px"
//                     }}
//                   />
//                 </div>
//                 <div className="form-group">
//                   <label style={{ fontWeight: "500", color: "#495057", marginBottom: "8px", display: "block" }}>Last Name</label>
//                   <input 
//                     type="text" 
//                     className="form-control" 
//                     value={profile.lastName}
//                     onChange={e => setProfile({...profile, lastName: e.target.value})} 
//                     required
//                     style={{ 
//                       borderRadius: "8px", 
//                       border: "2px solid #dee2e6",
//                       padding: "12px 15px",
//                       fontSize: "14px"
//                     }}
//                   />
//                 </div>
//               </div>
              
//               <div className="form-group" style={{ marginBottom: "30px" }}>
//                 <label style={{ fontWeight: "500", color: "#495057", marginBottom: "8px", display: "block" }}>Phone Number</label>
//                 <input 
//                   type="text" 
//                   className="form-control" 
//                   value={profile.phoneNumber}
//                   onChange={e => setProfile({...profile, phoneNumber: e.target.value})} 
//                   required
//                   style={{ 
//                     borderRadius: "8px", 
//                     border: "2px solid #dee2e6",
//                     padding: "12px 15px",
//                     fontSize: "14px"
//                   }}
//                 />
//               </div>
              
//               <button 
//                 type="submit" 
//                 className="btn btn-primary" 
//                 style={{ 
//                   width: "100%", 
//                   padding: "12px", 
//                   borderRadius: "8px", 
//                   fontWeight: "500",
//                   fontSize: "16px"
//                 }}
//               >
//                 Update Profile
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;