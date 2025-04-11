import AdminActions from "../organisms/AdminActions"
import ItemList from "../organisms/ItemList"

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <AdminActions />
      <ItemList isAdmin={true} />
    </div>
  )
}
export default AdminDashboard
