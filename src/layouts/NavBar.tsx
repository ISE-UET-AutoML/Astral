import { useState, useEffect, type MouseEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PATHS } from "src/constants/paths";
import useAuth from "src/features/auth/hooks/useAuth";
import clsx from "clsx";
import { useTheme } from "src/theme/ThemeProvider";
import {
  SunIcon,
  Moon as MoonIcon,
  Menu as MenuIcon,
  X as XIcon,
  Bell as BellIcon,
} from "lucide-react";
import { Button } from "src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "src/components/ui/navigation-menu";
import { useNotificationContext } from "src/shared/hooks/useNotification";

type AuthUser = {
  name?: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
};

type AuthState = {
  authed: boolean;
  logout: () => void;
  user?: AuthUser;
};

type NavItem = {
  name: string;
  href: string;
};

const NavBar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { authed, logout: authLogout, user } = useAuth() as AuthState;
  const { theme, toggle } = useTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotificationContext();
  const logoSrc = theme === "light" ? "/BlackLogo.svg" : "/PrimaryLogo.svg";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const y = window.pageYOffset || document.documentElement.scrollTop || 0;
    setScrolled(y > 0);
  }, [location.pathname]);

  const logout = () =>
    new Promise<void>((resolve) => {
      authLogout();
      navigate("/", { replace: true });
      resolve();
    });

  const publicNavigationItems: NavItem[] = [
    { name: "ABOUT", href: "#about" },
    { name: "PRICING", href: "#pricing" },
  ];
  const authNavigationItems: NavItem[] = [
    { name: "PROJECTS", href: PATHS.PROJECTS },
    { name: "DATASETS", href: PATHS.DATASETS },
  ];

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href);

  const handleNavigation = (href: string) => {
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(href);
    }
  };

  const handleNavLinkClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
    onNavigate?: () => void,
  ) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey
    ) {
      return;
    }

    event.preventDefault();
    handleNavigation(href);
    onNavigate?.();
  };

  const handleNotificationClick = (
    notificationId: string,
    reviewUrl?: string,
  ) => {
    markAsRead(notificationId);
    if (reviewUrl) {
      navigate(reviewUrl);
      setNotificationOpen(false);
    }
  };

  return (
    <header
      className={clsx(
        "fixed top-0 w-screen z-[20] transition-all duration-300",
        scrolled
          ? "bg-[var(--nav-bg)] backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 shadow-md dark:shadow-black/20"
          : "bg-[var(--nav-bg)] backdrop-blur-xl border-b border-gray-200/30 dark:border-white/5 shadow-sm",
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <a
              href="/"
              onClick={(event) => handleNavLinkClick(event, "/")}
              aria-label="ASTRAL home"
              className="block"
            >
              <img
                src={logoSrc}
                alt="ASTRAL"
                className="h-10 w-auto cursor-pointer transition-transform duration-300 hover:scale-105"
              />
            </a>
          </div>

          {/* Center: Nav items */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-8">
              {(authed ? authNavigationItems : publicNavigationItems).map(
                (item) => (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Button
                      asChild
                      variant="ghost"
                      className={clsx(
                        "relative h-auto rounded-none bg-transparent px-3 py-2 text-sm font-bold text-gray-900 transition-all duration-200 hover:bg-transparent hover:text-gray-900 dark:text-white dark:hover:bg-transparent dark:hover:text-white",
                        isActive(item.href)
                          ? "opacity-100"
                          : "opacity-75 hover:opacity-100",
                      )}
                    >
                      <a
                        href={item.href}
                        onClick={(event) =>
                          handleNavLinkClick(event, item.href)
                        }
                      >
                        {item.name}
                        {/* Animated underline */}
                        <div
                          className={clsx(
                            "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-[#5C8DFF] to-[#65FFA0] rounded-full transition-all duration-300",
                            hoveredItem === item.name || isActive(item.href)
                              ? "w-full opacity-100"
                              : "w-0 opacity-0",
                          )}
                        />
                      </a>
                    </Button>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Right: Theme + Login/Profile */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              onClick={toggle}
              aria-label="Toggle theme"
              className="ml-2 rounded-full border border-gray-200/50 bg-gray-100 text-gray-700 transition hover:bg-gray-200 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>

            {authed ? (
              <>
                <Popover
                  open={notificationOpen}
                  onOpenChange={setNotificationOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-lg"
                      aria-label="Notifications"
                      className="relative rounded-full border border-gray-200/50 bg-gray-100 text-gray-700 transition hover:bg-gray-200 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                    >
                      <BellIcon className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-80 rounded-xl border border-gray-200 bg-white p-0 dark:border-white/10 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-white/10">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </span>
                      {notifications.length > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={markAllAsRead}
                          className="h-auto rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                          Mark all read
                        </Button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((notification) => {
                          const reviewUrl =
                            typeof notification.metadata?.reviewUrl === "string"
                              ? notification.metadata.reviewUrl
                              : undefined;
                          return (
                            <button
                              key={notification.id}
                              type="button"
                              onClick={() =>
                                handleNotificationClick(
                                  notification.id,
                                  reviewUrl,
                                )
                              }
                              className="block w-full border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 dark:border-white/6 dark:hover:bg-white/5"
                            >
                              <div className="flex items-start gap-2">
                                {!notification.read && (
                                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500 dark:bg-blue-400" />
                                )}
                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                    {notification.message}
                                  </div>
                                  {notification.description && (
                                    <div className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                                      {notification.description}
                                    </div>
                                  )}
                                  {reviewUrl && (
                                    <div className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                                      Retraining now! &rarr;
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                <NavigationMenu
                  viewport={false}
                  className="relative max-w-none flex-none"
                >
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="transition flex h-auto gap-2 rounded-xl text-sm focus:outline-none py-2 px-3 bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/15 data-open:bg-gray-100 dark:data-open:bg-white/10 [&>svg]:hidden">
                        <span className="font-regular">
                          {user?.full_name || "USER"}
                        </span>
                        <img
                          className="h-6 w-6 border-2 border-blue-500 rounded-full"
                          src={
                            user?.avatarUrl ||
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          }
                          alt=""
                        />
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="right-0 left-auto z-10 mt-2 w-56 min-w-[14rem] bg-white dark:bg-[#222222] backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 dark:border-white/10 overflow-hidden focus:outline-none p-0">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => navigate(PATHS.PROFILE)}
                          className="block h-auto w-full justify-start rounded-none px-3 py-3 text-left text-sm font-normal text-gray-600 transition-all duration-200 hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white dark:focus:bg-white/10 dark:focus:text-white"
                        >
                          Your Profile
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => navigate(PATHS.SETTINGS)}
                          className="block h-auto w-full justify-start rounded-none border-b border-gray-200 px-3 py-3 text-left text-sm font-normal text-gray-600 transition-all duration-200 hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white dark:focus:bg-white/10 dark:focus:text-white"
                        >
                          Settings
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={async () => await logout()}
                          className="block h-auto w-full justify-start rounded-none px-3 py-3 text-left text-sm font-normal text-gray-600 transition-all duration-200 hover:bg-gray-200 hover:text-gray-900 focus:bg-gray-200 focus:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white dark:focus:bg-white/10 dark:focus:text-white"
                        >
                          Sign out
                        </Button>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </>
            ) : (
              <Button
                type="button"
                onClick={() => navigate("/login")}
                className="h-auto rounded-full border border-blue-400/50 bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors duration-200 hover:from-blue-600 hover:to-blue-700"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Open main menu</span>
              {navbarOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </Button>

            {/* Mobile menu panel */}
            {navbarOpen && (
              <div className="absolute top-16 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-700">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {(authed ? authNavigationItems : publicNavigationItems).map(
                    (item) => (
                      <Button
                        asChild
                        variant="ghost"
                        key={item.name}
                        className="block h-auto w-full justify-start rounded-md px-3 py-2 text-left text-base font-medium text-gray-900 opacity-80 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 hover:opacity-100 dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
                      >
                        <a
                          href={item.href}
                          onClick={(event) =>
                            handleNavLinkClick(event, item.href, () =>
                              setNavbarOpen(false),
                            )
                          }
                        >
                          {item.name}
                        </a>
                      </Button>
                    ),
                  )}
                  {!authed && (
                    <Button
                      type="button"
                      onClick={() => {
                        navigate("/login");
                        setNavbarOpen(false);
                      }}
                      className="mt-4 block h-auto w-full rounded-full bg-gray-800 px-3 py-2 text-center text-base font-medium text-white hover:bg-gray-700"
                    >
                      Login
                    </Button>
                  )}
                  {authed && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={async () => {
                        await logout();
                        setNavbarOpen(false);
                      }}
                      className="mt-4 block h-auto w-full rounded-full bg-red-800 px-3 py-2 text-center text-base font-medium text-white hover:bg-red-700"
                    >
                      Sign out
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
