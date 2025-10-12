import { useState, type SetStateAction } from "react";
import { motion } from "motion/react";
import { Home, Bell, Settings, Star, Newspaper, PanelLeftOpen, PanelRightOpen, Briefcase } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./ui/button";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import useResponsiveIconSize from "@/hooks/useResponsiveIcon";

type Item = {
  name: string;
  icon: React.ComponentType<{ size?: number }>;
  path: string;
  children?: Item[];
};

interface NavProp {
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}

const Nav: React.FC<NavProp> = ({ isOpen, setIsOpen }) => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const location = useLocation();
  const iconSize = useResponsiveIconSize();
  
  const toggleMenu = (name: string): void => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleToggleNav = (): void => {
    setIsOpen((prev) => !prev);
  };

  let userId;
  const userData = localStorage.getItem("user-data");
  if (userData) {
    userId = JSON.parse(userData).userId;
  }

  const navItems: Item[] = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Portfolio", icon: Briefcase, path: "/portfolio" },
    { name: "Watchlist", icon: Star, path: "/watchlist" },
    { name: "News", icon: Newspaper, path: `/news/trending` },
    { name: "Alerts", icon: Bell, path: `/alerts/${userId}` },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        initial={{ width: 60 }}
        animate={{ width: isOpen ? 200 : 60 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 20 }}
        className="hidden md:flex h-screen bg-gray-900 text-white flex-col gap-5 overflow-hidden"
      >
        <div className="p-2">
          <Button
            className="w-full justify-center"
            onClick={handleToggleNav}
            aria-label={isOpen ? "Collapse navigation" : "Expand navigation"}
          >
            {isOpen ? <PanelLeftOpen size={20} /> : <PanelRightOpen size={20} />}
          </Button>
        </div>

        <TooltipProvider delayDuration={0}>
          <nav className="flex-1 overflow-y-auto space-y-3">
            {navItems.map((item: Item, i: number) => {
              const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = openMenus[item.name];
              const IconComponent = item.icon;
              
              return (
                <div key={i}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {hasChildren ? (
                        <div
                          className={`flex items-center gap-3 p-2 mx-2 rounded-md cursor-pointer transition-colors ${
                            isActive
                              ? "bg-gray-700 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white"
                          }`}
                          onClick={() => toggleMenu(item.name)}
                        >
                          <IconComponent size={iconSize} />
                          {isOpen && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              className="truncate"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={item.path}
                          className={`flex items-center gap-3 p-2 mx-2 rounded-md transition-colors ${
                            isActive
                              ? "bg-gray-700 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white"
                          }`}
                        >
                          <IconComponent size={iconSize} />
                          {isOpen && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              className="truncate"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </Link>
                      )}
                    </TooltipTrigger>

                    {!isOpen && (
                      <TooltipContent side="right" className="bg-gray-800 text-white">
                        {item.name}
                      </TooltipContent>
                    )}
                  </Tooltip>

                  {isOpen && hasChildren && isExpanded && (
                    <motion.div
                      className="ml-6 flex flex-col gap-1"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.children?.map((child: Item, j: number) => (
                        <Link
                          key={j}
                          to={child.path}
                          className={`text-sm p-2 rounded-md transition-colors ${
                            location.pathname === child.path
                              ? "bg-gray-800 text-white"
                              : "text-gray-400 hover:text-white hover:bg-gray-800"
                          }`}
                        >
                          <span className="truncate">{child.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </nav>
        </TooltipProvider>
      </motion.div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-gray-900 text-white flex justify-around items-center h-14 z-50">
        {navItems.map((item: Item, i: number) => {
          const IconComponent = item.icon;
          const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
          
          return (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <Link
                  to={item.path}
                  className={`flex flex-col items-center justify-center p-2 flex-1 transition-colors ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:text-neon-purple"
                  }`}
                  aria-label={item.name}
                >
                  <IconComponent size={iconSize} />
                  <span className="text-xs mt-1 truncate">{item.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gray-800 text-white">
                {item.name}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </>
  );
};

export default Nav;