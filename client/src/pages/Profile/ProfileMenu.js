import { CiUser } from "react-icons/ci";
import { CiShoppingBasket } from "react-icons/ci";
import { IoBanOutline } from "react-icons/io5";
import { CiStar } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { MdOutlinePayment } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { FiSettings } from "react-icons/fi";

export const profileMenu = [
  {
    id: 1,
    title: "My Account",
    icon: CiUser,
    path: "/profile/account",
  },
  {
    id: 2,
    title: "My Orders",
    icon: CiShoppingBasket,
    path: "/profile/orders",
  },
  {
    id: 3,
    title: "Returns & Cancel",
    icon: IoBanOutline,
    path: "/profile/returns",
  },
  {
    id: 4,
    title: "My Rating & Reviews",
    icon: CiStar,
    path: "/profile/reviews",
  },
  {
    id: 5,
    title: "My Wishlist",
    icon: CiHeart,
    path: "/profile/wishlist",
  },
  {
    id: 6,
    title: "Payment",
    icon: MdOutlinePayment,
    path: "/profile/payment",
  },
  {
    id: 7,
    title: "Change Password",
    icon: TbLockPassword,
    path: "/profile/change-password",
  },
  {
    id: 8,
    title: "Settings",
    icon: FiSettings,
    path: "/profile/settings",
  },
];

