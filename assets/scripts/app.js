class DOMHelper {
  handleElementSwitch(projectId, parentElement) {
    const projectElement = document.getElementById(projectId);
    projectElement.closest("ul");

    const projectElementBtn = projectElement.querySelectorAll("button")[1];
    if (parentElement.id === "finished-projects") {
      projectElementBtn.textContent = "Activate";
      projectElementBtn.addEventListener(
        "click",
        () => {
          App.onFinishedProjectClick(projectId);
        },
        { once: true }
      );
    } else {
      projectElementBtn.textContent = "Finish";
      projectElementBtn.addEventListener(
        "click",
        () => {
          App.onHandleActiveClick(projectId);
        },
        { once: true }
      );
    }
    parentElement.querySelector("ul").appendChild(projectElement);
    projectElement.scrollIntoView({ behavior: "smooth" });
  }
}

class ProjectElement {
  constructor(id, hookId) {
    this.id = id;
    this.hookId = hookId;
    this.render();
  }
  render() {
    const element = document.getElementById(this.id);
    const moreInfoButton = element.querySelectorAll("button")[0];
    if (this.hookId === "active-projects") {
      const finishProjectButton = element.querySelectorAll("button")[1];
      finishProjectButton.addEventListener(
        "click",
        () => {
          App.onHandleActiveClick(this.id);
        },
        { once: true }
      );
    } else {
      const activateProjectButton = element.querySelectorAll("button")[1];
      activateProjectButton.addEventListener(
        "click",
        () => {
          App.onFinishedProjectClick(this.id);
        },
        { once: true }
      );
    }
    moreInfoButton.addEventListener("click", () => console.log(element));
  }
}

class Project extends DOMHelper {
  projects = [];

  constructor(renderHookId) {
    super();
    this.hookId = renderHookId;
    this.render();
    this.switchBackToDefault = () => this.switchProject(this.projects);
  }

  switchProjectHandler = (projectSwitch) => {
    projectSwitch();
  };

  switchProject = (projectObject) => {
    this.projects = projectObject;
  };

  render() {
    const projectElement = document.getElementById(this.hookId);
    const listItems = projectElement.querySelector("ul").querySelectorAll("li");
    this.projects.push(listItems);
    console.log(this.projects);
    for (const item of listItems) {
      new ProjectElement(item.id, this.hookId);
    }
  }

  activeProjectHandler(projectId) {
    console.log(this.projects);
    const projectToAdd = document.getElementById(projectId);
    if (projectToAdd) {
      this.projects.push(projectToAdd);
    }
    this.switchBackToDefault();
    const projectToBeRemoved = Array.from(this.projects).find(
      (project) => project.id === projectId
    );
    const parentElement = projectToAdd.closest("section").nextElementSibling;
    if (projectToBeRemoved) {
      this.projects.filter((project) => project.id !== projectId);
      const btn = projectToBeRemoved.querySelectorAll("button")[1];
      this.handleElementSwitch(projectId, parentElement);
    }
  }

  finishProjectHandler(projectId) {
    const projectElement = document.getElementById(projectId);
    if (projectElement) {
      this.projects.push(projectElement);
    }
    this.switchBackToDefault();
    const projectToBeRemoved = Array.from(this.projects).find(
      (project) => project.id === projectId
    );
    const parentElement =
      projectElement.closest("section").previousElementSibling;
    if (projectToBeRemoved) {
      this.projects.filter((project) => project.id !== projectId);
      const btn = projectToBeRemoved.querySelectorAll("button")[1];
      this.handleElementSwitch(projectId, parentElement);
    }
  }
}

class ProjectDetails {
  render() {
    const activeProject = new Project("active-projects");
    const finishedProject = new Project("finished-projects");
    const activeProjectSwitch = activeProject.switchProject.bind(
      activeProject,
      finishedProject.projects
    );
    const finishedProjectSwitch = finishedProject.switchProject.bind(
      finishedProject,
      activeProject.projects
    );
    activeProject.switchProjectHandler(() => activeProjectSwitch());
    finishedProject.switchProjectHandler(() => finishedProjectSwitch());

    this.activeProjectHandler =
      activeProject.activeProjectHandler.bind(activeProject);
    this.finishProjectHandler =
      finishedProject.finishProjectHandler.bind(finishedProject);
  }
}

class App {
  static init() {
    const project = new ProjectDetails();
    project.render();
    this.projects = project;
  }

  static onHandleActiveClick(projectId) {
    console.log(projectId);
    this.projects.activeProjectHandler(projectId);
  }

  static onFinishedProjectClick(projectId) {
    console.log("Clicked....");
    this.projects.finishProjectHandler(projectId);
  }
}

App.init();
