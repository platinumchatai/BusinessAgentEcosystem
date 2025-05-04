useEffect(() => {
    const scrollToWorkflows = sessionStorage.getItem("scrollToWorkflows");
    const hash = window.location.hash.substring(1);

    if (scrollToWorkflows === "true") {
      sessionStorage.removeItem("scrollToWorkflows");
      setTimeout(() => {
        const workflowsSection = document.getElementById("workflows");
        if (workflowsSection) {
          const headerOffset = 80;
          const elementPosition = workflowsSection.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);