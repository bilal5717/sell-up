
import carBanner from '@/public/images/BannerImages/bannerimagecar.png';
import textBanner from '@/public/images/BannerImages/textBanner.png';
import Carousel from "@/components/common/HeaderBanner";
import CategoriesBox from '@/components/common/CategoriesBox/CategoryBox';
import Mobiles from "@/components/ProductCards/Mobile";
import Bikes from "@/components/ProductCards/Bikes";
import Houses from "@/components/ProductCards/Houses";
import LandsAndPlots from "@/components/ProductCards/LandNPlots";
import Jobs from "@/components/ProductCards/Jobs";


const images = [
  { src: carBanner.src },
  { src: carBanner.src },
  { src: textBanner.src },
];
export default function Home() {
  return (
    <>
    <main>
        <div className="container">
          <div className="row">
              <div className="col-12">
              <Carousel images={images} />
              </div>
              <div className="col-12">
                 <CategoriesBox  />
              </div>
              <div className="col-12">
                 <Mobiles  />
              </div>
              {/* <div className="col-12">
                 <Bikes  />
              </div>
              <div className="col-12">
                 <Houses  />
              </div>
              <div className="col-12">
                 <LandsAndPlots  />
              </div>
              <div className="col-12">
                 <Jobs  />
              </div> */}
          </div>
        </div>
          
        
    
    </main>
    </>
  );
}
