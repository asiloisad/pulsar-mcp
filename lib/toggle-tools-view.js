const { SelectListView, highlightMatches } = require("pulsar-select-list");

class ToggleToolsView {
  constructor(getTools) {
    this.getTools = getTools;
    this.disabledTools = [];
    this.selectList = new SelectListView({
      className: "pulsar-mcp",
      emptyMessage: "No MCP tools found",
      willShow: () => {
        this.disabledTools = atom.config.get("pulsar-mcp.disabledTools") || [];
        this.selectList.update({ items: this.getTools() });
      },
      filterKeyForItem: (item) => item.name + " " + item.description,
      elementForItem: (item, { matchIndices }) => {
        const isDisabled = this.disabledTools.includes(item.name);
        const li = document.createElement("li");
        li.classList.add("two-lines");
        const primary = document.createElement("div");
        primary.classList.add("primary-line");
        const icon = document.createElement("span");
        icon.classList.add("icon", isDisabled ? "icon-circle-slash" : "icon-check");
        primary.appendChild(icon);
        const tag = document.createElement("span");
        tag.classList.add("tag");
        tag.appendChild(highlightMatches(item.name, matchIndices));
        primary.appendChild(tag);
        li.appendChild(primary);
        if (item.description) {
          const secondary = document.createElement("div");
          secondary.classList.add("secondary-line");
          secondary.textContent = item.description;
          li.appendChild(secondary);
        }
        return li;
      },
      didConfirmSelection: (item) => {
        const index = this.selectList.selectionIndex;
        this.toggleTool(item.name);
        this.selectList.update({ items: this.getTools() });
        this.selectList.selectIndex(index);
      },
      didCancelSelection: () => {
        this.selectList.hide();
      },
    });
  }

  toggle() {
    this.selectList.toggle();
  }

  toggleTool(name) {
    const index = this.disabledTools.indexOf(name);
    if (index === -1) {
      this.disabledTools.push(name);
    } else {
      this.disabledTools.splice(index, 1);
    }
    atom.config.set("pulsar-mcp.disabledTools", this.disabledTools);
  }

  destroy() {
    this.selectList.destroy();
  }
}

module.exports = ToggleToolsView;
