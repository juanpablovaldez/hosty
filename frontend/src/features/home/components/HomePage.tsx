import { useTranslation } from "react-i18next";

export function HomePage() {
  const { t } = useTranslation();

  return (
    <main className="flex flex-col justify-center items-center gap-4 min-h-screen">
      <h1 className="font-bold text-4xl">{t("home.title")}</h1>
      <p className="text-muted-foreground">{t("home.subtitle")}</p>
    </main>
  );
}
