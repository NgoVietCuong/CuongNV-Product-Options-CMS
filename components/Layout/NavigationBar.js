import { useRouter } from "next/router";
import { Navigation } from "@shopify/polaris";
import { FaHome } from "react-icons/fa";
import { IoIosListBox } from "react-icons/io";

export default function NavigationBar() {
  const router = useRouter();

  const isSelected = (path) => {
    const isRoot = path === "/";
    if (isRoot) {
      return router.pathname === path;
    } else {
      return router.pathname.includes(path);
    }
  };

  return (
    <Navigation>
      <Navigation.Section
        items={[
          {
            label: "Dashboard",
            icon: FaHome,
            selected: isSelected("/"),
            onClick: () => router.pathname !== "/" && router.push("/"),
          },
          {
            label: "Option Sets",
            icon: IoIosListBox,
            selected: isSelected("/option-sets"),
            onClick: () => router.pathname !== "/option-sets" && router.push("/option-sets"),
          }
        ]}
      />
    </Navigation>
  )
}