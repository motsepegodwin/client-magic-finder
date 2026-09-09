import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bush Taxi Management System" },
      {
        name: "description",
        content:
          "Bush Taxi Association management system: members, vehicles, routes, payments, receipts, penalties and funeral plans.",
      },
      { property: "og:title", content: "Bush Taxi Management System" },
      {
        property: "og:description",
        content:
          "Manage Bush Taxi Association members, payments and receipts in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/app/index.html");
  }, []);

  return null;
}
