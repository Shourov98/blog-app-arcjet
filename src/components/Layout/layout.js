import Header from "./header";

export default function CommonLayout({ children }) {

  const isAuthenticated = false; 
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {isAuthenticated && <Header />}
      { children }
    </div>
  );
}