var actvDiv;
var actvTab;

function setTab(tab, div) {
    if (actvTab) actvTab.style.border = "none";
    actvTab = tab; tab.style.borderBottom = "2px solid var(--secondary-color)";
    if(actvDiv) actvDiv.hidden = true; actvDiv = get(div); actvDiv.hidden = false;
}



