"use client";
import { Banner } from "./components/Banner/Banner";
import ProjectSections from "./components/ReadyProjects";


export default function Home() {
  return (
    <section>
      <Banner />
      <ProjectSections />
    </section>
  );
}
