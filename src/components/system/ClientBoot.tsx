"use client";

import { useEffect } from "react";

const ClientBoot = () => {
  useEffect(() => {
    document.documentElement.classList.add("js-ready");
  }, []);

  return null;
};

export default ClientBoot;
