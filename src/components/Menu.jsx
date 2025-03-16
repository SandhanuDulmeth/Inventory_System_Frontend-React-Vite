import { Link } from 'react-router-dom';

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        label: "Home",
        href: "/",
        icon: "home",
      },
      {
        label: "Inventory Management",
        href: "/inventory",
        icon: "inventory",
      },
      {
        label: "Orders",
        href: "/orders",
        icon: "orders",
      },
      {
        label: "Suppliers",
        href: "/suppliers",
        icon: "suppliers",
      },
      {
        label: "Reports",
        href: "/reports",
        icon: "reports",
      },
      {
        label: "Help & Support",
        href: "/help-support",
        icon: "help",
      },
      {
        label: "Analysis",
        href: "/analysis",
        icon: "analysis",
      }
    ],
  }
];

const icons = {
  home: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house-door" viewBox="0 0 16 16">
      <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z" />
    </svg>
  ),
  inventory: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-seam" viewBox="0 0 16 16">
      <path d="M2.5 1.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 2 6V1.5zm0 7A.5.5 0 0 1 3 8h10a.5.5 0 0 1 .5.5V14a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5V8.5z" />
    </svg>
  ),
  orders: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
      <path d="M0 1a1 1 0 0 1 1-1h2a1 1 0 0 1 .96.72L4.84 3H14a1 1 0 0 1 .96 1.28l-1.5 6A1 1 0 0 1 12.5 11H5.1l-.28 1.11A.5.5 0 0 1 4.5 13H1a1 1 0 0 1-1-1V1z" />
    </svg>
  ),
  suppliers: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-truck" viewBox="0 0 16 16">
      <path d="M3 1a1 1 0 0 0-1 1v11h1a2 2 0 1 0 4 0h4a2 2 0 1 0 4 0h1V5.5L13 1H3z" />
    </svg>
  ),
  reports: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-bar-graph" viewBox="0 0 16 16">
    <path d="M10 13.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-6a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5zm-2.5.5a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5zm-3 0a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5z"/>
    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
  </svg>
  ),
  help: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-question-circle" viewBox="0 0 16 16">
      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 1a6 6 0 1 1 0 12A6 6 0 0 1 8 2zm.5 10a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-.125-3.125a.625.625 0 1 0-1.25 0 .75.75 0 0 0 1.5 0 1.375 1.375 0 1 1-2.75 0 .75.75 0 0 0-1.5 0 2.875 2.875 0 1 0 5.75 0 .625.625 0 1 0-1.25 0z" />
    </svg>
  ),
  analysis: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-graph-up" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07" />
    </svg>
  )
};

const Menu = () => {
  return (
    <div className="h-full py-6 px-4">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-3" key={i.title}>
          <span className="text-gray-400 font-medium text-sm px-2 py-4">
            {i.title}
          </span>
          {i.items.map((item) => (
            <Link to={item.href} key={item.label} className="flex items-center gap-4 text-gray-600 px-2 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              {icons[item.icon]}
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
