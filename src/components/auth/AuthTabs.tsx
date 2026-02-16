"use client";

import AuthForm from "./AuthForm";

type AuthTabsProps = {
  setModalBusy: (isBusy: boolean) => void;
};

const AuthTabs = ({ setModalBusy }: AuthTabsProps) => {
  return <AuthForm setModalBusy={setModalBusy} />;
};

export default AuthTabs;