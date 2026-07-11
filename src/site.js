(function () {
  function normalize(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Mn}/gu, "");
  }

  function slugify(str) {
    return normalize(str)
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }

  function setupSearch() {
    var searchInput = document.getElementById("search-input");
    var cards = document.querySelectorAll(".article-card");
    var noResults = document.querySelector(".no-results");
    if (!searchInput || !cards.length) return;

    function applyFilter() {
      var query = normalize(searchInput.value.trim());
      var visibleCount = 0;

      cards.forEach(function (card) {
        var text = normalize(card.textContent);
        var show = query === "" || text.indexOf(query) !== -1;
        card.hidden = !show;
        if (show) visibleCount++;
      });

      if (noResults) {
        noResults.hidden = visibleCount !== 0;
      }
    }

    searchInput.addEventListener("input", applyFilter);

    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    if (q) {
      searchInput.value = q;
      applyFilter();
      searchInput.scrollIntoView({ block: "center" });
    }
  }

  function setupToc() {
    var placeholder = document.querySelector(".toc-placeholder");
    var body = document.querySelector(".article-body");
    if (!placeholder || !body) return;

    var headings = body.querySelectorAll("h2");
    if (headings.length < 2) return;

    var nav = document.createElement("nav");
    nav.className = "toc";
    nav.setAttribute("aria-label", "Contenido del artículo");

    var title = document.createElement("p");
    title.className = "toc-title";
    title.textContent = "En este artículo";
    nav.appendChild(title);

    var list = document.createElement("ol");

    headings.forEach(function (heading, index) {
      var id = heading.id;
      if (!id) {
        var base = slugify(heading.textContent) || "seccion-" + (index + 1);
        var uniqueId = base;
        var suffix = 2;
        while (document.getElementById(uniqueId)) {
          uniqueId = base + "-" + suffix++;
        }
        heading.id = uniqueId;
        id = uniqueId;
      }

      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + id;
      a.textContent = heading.textContent;
      li.appendChild(a);
      list.appendChild(li);
    });

    nav.appendChild(list);
    placeholder.appendChild(nav);
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupSearch();
    setupToc();
  });
})();
