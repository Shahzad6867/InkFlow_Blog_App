import { deleteDoc,doc } from "firebase/firestore"; // Make sure to import deleteDoc
import toast from "react-hot-toast";
import { db } from "../../firebase";
// Inside your BlogForm component:
export const handleDeleteConfirmation = (blog_id,setBlogs,blogs,navigate) => {
  toast((t) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <p style={{ margin: 0, fontWeight: '500' , textAlign : "center"}}>
        Are you sure you want to delete this blog?
      </p>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        {/* Cancel Button */}
        <button 
          onClick={() => toast.dismiss(t.id)}
          style={{ padding: '4px 8px', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Cancel
        </button>
        {/* Delete Button */}
        <button
          onClick={async () => {
            toast.dismiss(t.id); // Close the confirmation toast first
            
            // Execute the actual deletion with a promise toast
            toast.promise(deleteDoc(doc(db, "blogs", blog_id)), {
              loading: 'Deleting blog...',
              success: 'Blog deleted successfully!',
              error: 'Failed to delete blog.',
            }).then(() => {
                blogs = blogs.filter(blog => blog.blog_id !== blog_id);
                setBlogs(blogs)
                navigate("/home")
            });
          }}
          style={{ padding: '4px 8px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Delete
        </button>
      </div>
    </div>
  ), {
    duration: Infinity, // Keeps the toast open until the user acts
    position: 'top-center',
  });
};
