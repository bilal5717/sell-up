"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { LuSquarePen } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";
import logo from '@public/logo.jpg';

interface MenuLink {
  text: string;
  icon: string;
}
interface TabProps {
  active?: boolean;
}
interface SubCategory {
  title: string;
  links: MenuLink[];
}

interface MegaMenuItem {
  title: string;
  subCategories?: SubCategory[];
  links?: MenuLink[];
  isSeparator?: boolean;
}

const TopNav = () => {
  const [hoveredMenu, setHoveredMenu] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Set to true after component mounts (client-side)
  }, []);

  // Mega menu data with sub-categories
  const megaMenus: MegaMenuItem[] = [
    {
      title: "All Categories",
      subCategories: [
        {
          title: "Ecommerce",
          links: [
            { text: "Magento Development", icon: "fab fa-magento" },
            { text: "Magento 2 Migration", icon: "fab fa-magento" },
            { text: "Odoo ERP", icon: "fab fa-magento" },
            { text: "Mobile Commerce", icon: "fab fa-magento" },
            { text: "CRM for Commerce", icon: "fab fa-magento" },
          ],
        },
        {
          title: "LAMP Technology",
          links: [
            { text: "PHP Website Development", icon: "fab fa-php" },
            { text: "Phalcon Development", icon: "fas fa-circle" },
            { text: "Laravel Development", icon: "fab fa-laravel" },
            { text: "WordPress Development", icon: "fab fa-wordpress-simple" },
            { text: "Symfony Development", icon: "fab fa-php" },
          ],
        },
        {
          title: "Mobile",
          links: [
            { text: "iPhone App Development", icon: "fab fa-apple" },
            { text: "Android App Development", icon: "fab fa-android" },
            { text: "Phone Gap App Development", icon: "fas fa-mobile-alt" },
            { text: "Hybrid App Development", icon: "fas fa-tablet-alt" },
            { text: "Ionic Development", icon: "fas fa-mobile-alt" },
            { text: "React Native Development", icon: "fas fa-tablet-alt" },
            { text: "Xamarin App Development", icon: "fas fa-mobile-alt" },
          ],
        },
        {
          title: "Node.js & MongoDB",
          links: [
            { text: "Full Stack Development", icon: "fas fa-cubes" },
            { text: "MEAN Stack", icon: "fas fa-cube" },
            { text: "AngularJS", icon: "fab fa-angular" },
            { text: "Node.JS Development", icon: "fab fa-node-js" },
            { text: "MongoDB Development", icon: "fas fa-leaf fa-rotate-90" },
          ],
        },
        {
          title: "Microsoft Technology",
          links: [
            { text: "Microsoft App Development", icon: "fab fa-windows" },
            { text: "MS Desktop App Development", icon: "fab fa-windows" },
            { text: "SharePoint Development", icon: "fab fa-windows" },
            { text: "ASP.NET Development", icon: "fab fa-windows" },
            { text: "CMS Development", icon: "fab fa-windows" },
          ],
        },
        {
          title: "Cloud Services",
          links: [
            { text: "DevOps", icon: "fas fa-cloud" },
            { text: "Amazon Web Services", icon: "fab fa-amazon" },
            { text: "Azure Cloud Service", icon: "fab fa-windows" },
            { text: "Google App Engine Services", icon: "fab fa-google" },
          ],
        },
        {
          title: "Enterprise Services",
          links: [
            { text: "Augmented Reality", icon: "fas fa-laptop" },
            { text: "CRM", icon: "fas fa-laptop" },
            { text: "Enterprise Mobility Services", icon: "fab fa-buromobelexperte" },
            { text: "Blockchain Services", icon: "fas fa-th-large" },
            { text: "Business Intelligence", icon: "fas fa-briefcase" },
          ],
        },
        {
          title: "Digital Marketing",
          links: [
            { text: "Digital Marketing", icon: "fas fa-laptop" },
            { text: "PPC Management Services", icon: "fas fa-laptop" },
            { text: "E-commerce SEO Services", icon: "fas fa-laptop" },
            { text: "Conversion Rate Optimization", icon: "fas fa-laptop" },
          ],
        },
      ],
    },
    { 
      title: "Mobile", 
      subCategories: [
        {
          title: "Ecommerce",
          links: [
            { text: "Magento Development", icon: "fab fa-magento" },
            { text: "Magento 2 Migration", icon: "fab fa-magento" },
            { text: "Odoo ERP", icon: "fab fa-magento" },
            { text: "Mobile Commerce", icon: "fab fa-magento" },
            { text: "CRM for Commerce", icon: "fab fa-magento" },
          ],
        },
        {
          title: "LAMP Technology",
          links: [
            { text: "PHP Website Development", icon: "fab fa-php" },
            { text: "Phalcon Development", icon: "fas fa-circle" },
            { text: "Laravel Development", icon: "fab fa-laravel" },
            { text: "WordPress Development", icon: "fab fa-wordpress-simple" },
            { text: "Symfony Development", icon: "fab fa-php" },
          ],
        },
        {
          title: "Mobile",
          links: [
            { text: "iPhone App Development", icon: "fab fa-apple" },
            { text: "Android App Development", icon: "fab fa-android" },
            { text: "Phone Gap App Development", icon: "fas fa-mobile-alt" },
            { text: "Hybrid App Development", icon: "fas fa-tablet-alt" },
            { text: "Ionic Development", icon: "fas fa-mobile-alt" },
            { text: "React Native Development", icon: "fas fa-tablet-alt" },
            { text: "Xamarin App Development", icon: "fas fa-mobile-alt" },
          ],
        },
        {
          title: "Node.js & MongoDB",
          links: [
            { text: "Full Stack Development", icon: "fas fa-cubes" },
            { text: "MEAN Stack", icon: "fas fa-cube" },
            { text: "AngularJS", icon: "fab fa-angular" },
            { text: "Node.JS Development", icon: "fab fa-node-js" },
            { text: "MongoDB Development", icon: "fas fa-leaf fa-rotate-90" },
          ],
        },
        {
          title: "Microsoft Technology",
          links: [
            { text: "Microsoft App Development", icon: "fab fa-windows" },
            { text: "MS Desktop App Development", icon: "fab fa-windows" },
            { text: "SharePoint Development", icon: "fab fa-windows" },
            { text: "ASP.NET Development", icon: "fab fa-windows" },
            { text: "CMS Development", icon: "fab fa-windows" },
          ],
        },
        {
          title: "Cloud Services",
          links: [
            { text: "DevOps", icon: "fas fa-cloud" },
            { text: "Amazon Web Services", icon: "fab fa-amazon" },
            { text: "Azure Cloud Service", icon: "fab fa-windows" },
            { text: "Google App Engine Services", icon: "fab fa-google" },
          ],
        },
        {
          title: "Enterprise Services",
          links: [
            { text: "Augmented Reality", icon: "fas fa-laptop" },
            { text: "CRM", icon: "fas fa-laptop" },
            { text: "Enterprise Mobility Services", icon: "fab fa-buromobelexperte" },
            { text: "Blockchain Services", icon: "fas fa-th-large" },
            { text: "Business Intelligence", icon: "fas fa-briefcase" },
          ],
        },
        {
          title: "Digital Marketing",
          links: [
            { text: "Digital Marketing", icon: "fas fa-laptop" },
            { text: "PPC Management Services", icon: "fas fa-laptop" },
            { text: "E-commerce SEO Services", icon: "fas fa-laptop" },
            { text: "Conversion Rate Optimization", icon: "fas fa-laptop" },
          ],
        },
      ] 
    },
    { title: "Laptops", links: [] },
    { title: "Vehicles", links: [] },
    { title: "Real Estate", links: [] },
    { title: "Services", links: [] },
    { title: "|", links: [], isSeparator: true },
    { title: "Seller Center", links: [] },
  ];

  // Handle hover on menu items
  const handleMouseEnter = (index: number) => {
    if (isClient) {
      setHoveredMenu(index);
    }
  };

  const handleMouseLeave = () => {
    if (isClient) {
      setHoveredMenu(null);
    }
  };

  return (
    <Nav>
      {/* Logo on the left */}
      <div className="col-1">
        <Logo>
          <Image
            src={logo}
            alt="Logo"
            style={{ width: '90px', height: '45px' }}
            priority
          />
        </Logo>
      </div>

      {/* Mega menus in the center */}
      <MegaMenus>
        {megaMenus.map((menu, index) => (
          <MegaMenuItem
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            
            {menu.isSeparator ? (
              <Separator>|</Separator>
            ) : (
              <MenuTitle>{menu.title}</MenuTitle>
            )}
            {isClient && hoveredMenu === index && menu.subCategories && (
              <MegaMenuContent>
                <div className="row">
                  {menu.subCategories.map((subCategory, i) => (
                    <div key={i} className="col-sm-6 col-lg-3 border-right mb-4">
                      <h6> {subCategory.title}</h6>
                      {subCategory.links.map((link, j) => (
                        <MenuLink key={j} href="#">
                          <i className={link.icon}></i> {link.text}
                        </MenuLink>
                      ))}
                    </div>
                  ))}
                </div>
              </MegaMenuContent>
            )}
          </MegaMenuItem>
        ))}
      </MegaMenus>

      {/* Links on the right */}
      <RightLinks>
        <Link href={`/post`}>
          <EditButton>
            <LuSquarePen size={16} />
            <span>Add New Post</span>
          </EditButton>
        </Link>
      </RightLinks>
    </Nav>
  );
};

export default TopNav;

// Styled Components
const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0;
  width: 100%;
`;

const Logo = styled.div`
  img {
    height: 40px;
  }
`;

const MegaMenus = styled.div`
  display: flex;
  position: relative;
`;

const MegaMenuItem = styled.div`
  position: relative;
  font-size: 12px;
  cursor: pointer;
`;

const MenuTitle = styled.span<TabProps>`
  padding: 5px 10px;
  font-weight: bold;
  text-transform: uppercase;
  transition: color 0.2s ease;
  color: ${(props) => (props.active ? "#a9252b" : "#171717")};
  
  &:hover {
    color: var(--foreground-hover, #a9252b);
  }
`;

const MegaMenuContent = styled.div`
  position: absolute;
  top: 100%;
  left: -100;
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 10px;
  width: 800px;
  z-index: 1000;

  .row {
    display: flex;
    flex-wrap: wrap;
  }

  .col-sm-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .col-lg-3 {
    flex: 0 0 25%;
    max-width: 25%;
  }

  h6 {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
  }
`;

const MenuLink = styled.a`
  font-size: 12px;
  color: #333;
  text-decoration: none;
  display: block;
  padding: 5px 0;

  &:hover {
    color: #a9252b;
  }

  i {
    margin-right: 5px;
  }
`;

const RightLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const Separator = styled.span`
  padding: 5px 10px;
  color: #333;
  font-weight: normal;
  cursor: default;
`;

const EditButton = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 12px;
  color: #fff;
  text-decoration: none;
  background-color: #a9252b;
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: #a9252b;
    color: #fff;
  }

  span {
    font-weight: bold;
  }
`;