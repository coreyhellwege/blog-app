const Layout = ({ children }) => {
  return (
    <React.Fragment>
      <p>Header</p>
      {children}
      <p>Footer</p>
    </React.Fragment>
  );
};

export default Layout;
