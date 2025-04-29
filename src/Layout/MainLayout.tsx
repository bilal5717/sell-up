// src/layouts/MainLayout.tsx
import TopNav from '@components/layout/Header/TopNav';
import Header from '@components/layout/Header/MainHeader';
/* import Footer from '@/components/Footer'; */
import { ReactNode } from 'react';

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <div className="container-fluid  px-5 py-2">
          <div className="row">
              <div className="col-12">
                  <TopNav />
              </div>
              <div className="col-12">
              <Header />
              </div>
              <div className="col-12">
                
                <main>{children}</main>
      
              </div>
              <div className="col-12">
                {/* <Footer /> */}
              </div>
          </div>
      </div>
      
    </>
  );
};

export default MainLayout;
