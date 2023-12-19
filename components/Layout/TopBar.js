import { TopBar } from "@shopify/polaris";

export default function CustomTopBar({ toggleMobileNavigationActive }) {

  const userMenuMarkup = (
    <TopBar.UserMenu
      name="Test CuongNV DA 2"
      initials="CD"
    />
  );

  return (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      onNavigationToggle={toggleMobileNavigationActive}
    />
  )
}