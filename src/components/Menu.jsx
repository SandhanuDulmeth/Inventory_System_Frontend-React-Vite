import { Link } from 'react-router-dom';

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/home.png",
        label: "Home",
        href: "/",
      },
      {
        icon: "/home.png",
        label: "Teachers",
        href: "/",
      },
      {
        icon: "/home.png",
        label: "Students",
        href: "/",
      },
      {
        icon: "/home.png",
        label: "Parents",
        href: "/",
      }
    ],
  }
];

const Menu = () => {
  return (
    <div className="h-full py-6 px-4">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-3" key={i.title}>
          <span className="text-gray-400 font-medium text-sm px-2 py-4">
            {i.title}
          </span>
          {i.items.map((item) => (
            <Link
              to={item.href}
              key={item.label}
              className="flex items-center gap-4 text-gray-600 px-2 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <img src={item.icon} alt="" className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
