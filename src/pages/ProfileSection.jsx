import React from "react";
import ManageAccountOptionList from "../ui/ManageAccountOptionList";
import UserProfilePage from "../components/UserProfilePage";
import LoginMob from "../login/LoginMob";
import supabase from "../supabase";
// import SellerForm from "../AdminSeller/seller/SellerForm";
import { Outlet } from "react-router-dom";

const ProfileSection = () => {
  const [user, setUser] = React.useState(null);
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (mounted) {
          setUser(data?.user ?? null);
        }
      } finally {
        if (mounted) setChecking(false);
      }
    };
    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) setUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  // Render based on auth state below; avoid early return to prevent flicker during checking

  return (
    <>
      <div className="flex w-full gap-4 p-2 ">
        <div className="hidden md:flex w-[20%]">
          <ManageAccountOptionList />
        </div>

        {checking ? (
          <div className="w-full flex items-center justify-center py-10 text-gray-500">
            Checking authentication...
          </div>
        ) : user ? (
          <div className="w-full md:w-[80%]">
            <Outlet />
          </div>
        ) : (
          <div className="md:w-full justify-center flex">
            <div className="md:w-1/2">
              <LoginMob />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileSection;
