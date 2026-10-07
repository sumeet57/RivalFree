import { useEffect, useState } from "react";
import { getProjects } from "../api/project.api";
import { getFeaturesByProject } from "../api/feature.api";

// How much of the plan the user has used: project count + features across all projects.
export function useUsage() {
  const [usage, setUsage] = useState({ loading: true, projects: null, features: null });

  useEffect(() => {
    (async () => {
      try {
        const projects = await getProjects();
        const lists = await Promise.all(
          projects.map((p) => getFeaturesByProject(p._id).catch(() => []))
        );
        const features = lists.filter(Array.isArray).flat().length;
        setUsage({ loading: false, projects: projects.length, features });
      } catch {
        setUsage({ loading: false, projects: null, features: null });
      }
    })();
  }, []);

  return usage;
}
