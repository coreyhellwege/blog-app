import Layout from "../../components/Layout";
import Private from "../../components/auth/Private";
import Link from "next/link";

const UserIndex = () => {
  return (
    <Layout>
      <Private>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>User Dashboard</h2>
            </div>
            <div className="col-md-4">
              <ul className="list-group">
                <li className="list-group-item">
                  {/* use an anchor tag here instead of Link to force the page to reload */}
                  {/* so we know the text editor will load it's CSS properly */}
                  <a href="/user/crud/blog">Create Blog</a>
                </li>
                <li className="list-group-item">
                  <Link href="/user/crud/blogs">
                    <a>Update/Delete Blogs</a>
                  </Link>
                </li>
                <li className="list-group-item">
                  <a href="/user/update">Update Profile</a>
                </li>
              </ul>
            </div>
            <div className="col-md-8">right</div>
          </div>
        </div>
      </Private>
    </Layout>
  );
};

export default UserIndex;
