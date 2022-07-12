class DOMHelper {
  constructor() {}

  handleElementSwitch(projectId, parentElement) {
    const projectElement = document.getElementById(projectId);
    projectElement.closest("ul");

    const projectElementBtn = projectElement.querySelectorAll("button")[1];
    if (parentElement.id === "finished-projects") {
      projectElementBtn.textContent = "Activate";
    } else {
      projectElementBtn.textContent = "Finish";
    }
    projectElementBtn.addEventListener(
      "click",
      () => this.projectFinishedOrActivateHandler(projectId),
      {
        once: true,
      }
    );
    parentElement.querySelector("ul").appendChild(projectElement);
    projectElement.scrollIntoView({ behavior: "smooth" });
  }

  detachToolTip(toolTip) {
    this.element.removeChild(toolTip);
    this.setToolTipActiveState();
  }

  appendToolTipToList(text, parentList) {
    const toolTip = document.createElement("div");
    toolTip.className = "card";
    const elmPositionTop = this.element.offsetTop;
    const elmPositionLeft = this.element.offsetLeft;
    const elmPositionHeight = this.element.clientHeight;
    console.log(elmPositionHeight);
    const parentElementScorllTop = this.element.parentElement.scrollTop;

    let y = elmPositionHeight + elmPositionTop - parentElementScorllTop - 30;

    this.element.closest("ul").addEventListener("scroll", () => {
      y =
        elmPositionHeight +
        elmPositionTop -
        30 -
        this.element.closest("ul").scrollTop;
      toolTip.style.top = y + "px";
    });

    const x = elmPositionLeft + 20;

    toolTip.style.position = "absolute";
    toolTip.style.display = "inline";
    toolTip.style.cursor = "pointer";
    toolTip.style.left = x + "px";
    toolTip.style.top = y + "px";

    const toolTipTemplate = document.getElementById("tooltip");
    const toolTipBody = document.importNode(toolTipTemplate.content, true);
    toolTipBody.querySelector("p").innerText = text;
    toolTip.append(toolTipBody)
    toolTip.addEventListener("click", () => this.detachToolTip(toolTip));
    this.element.appendChild(toolTip);
  }
}

class ProjectElement extends DOMHelper {
  constructor(id, hookId, clickButtonHandler) {
    super();
    this.id = id;
    this.hookId = hookId;
    this.hasActiveToolTip = false;
    this.clickButtonHandler = clickButtonHandler();
    this.render();
  }
  render() {
    this.element = document.getElementById(this.id);
    const buttons = this.element.querySelectorAll("button");
    const moreInfoButton = buttons[0];
    const finishProjectButton = buttons[1];
    finishProjectButton.addEventListener(
      "click",
      () => this.clickButtonHandler(this.id),
      { once: true }
    );
    moreInfoButton.addEventListener("click", () =>
      this.toolTipHandler(this.id)
    );
  }

  setToolTipActiveState() {
    if (this.hasActiveToolTip) {
      this.hasActiveToolTip = false;
    } else {
      this.hasActiveToolTip = true;
    }
  }

  toolTipHandler() {
    if (this.hasActiveToolTip) {
      return;
    }
    const parentListEl = this.element.closest("ul");
    const textContent = this.element.dataset.extraInfo;
    this.appendToolTipToList(textContent, parentListEl);
    this.setToolTipActiveState();
  }
}

class Project extends DOMHelper {
  projects = [];

  constructor(renderHookId) {
    super();
    this.hookId = renderHookId;
    this.render();
    this.switchBackToDefault = () =>
      this.switchProject.bind(this, this.projects);
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
      new ProjectElement(item.id, this.hookId, () =>
        this.projectFinishedOrActivateHandler.bind(this)
      );
    }
  }

  projectFinishedOrActivateHandler(projectId) {
    const projectToAdd = document.getElementById(projectId);
    if (projectToAdd) {
      this.projects.push(projectToAdd);
    }

    this.switchBackToDefault();
    const projectToBeRemoved = Array.from(this.projects).find(
      (project) => project.id === projectId
    );
    let parentElement = projectToAdd.closest("section").nextElementSibling;
    if (projectToAdd.closest("section").id === "finished-projects") {
      parentElement = projectToAdd.closest("section").previousElementSibling;
    }
    if (projectToBeRemoved) {
      this.projects.filter((project) => project.id !== projectId);
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
    activeProject.switchProjectHandler(activeProjectSwitch);
    finishedProject.switchProjectHandler(finishedProjectSwitch);
  }
}

class App {
  static init() {
    const project = new ProjectDetails();
    project.render();
    this.projects = project;
  }
}

App.init();
