function getData() {
  // Make a request to the FBI API
  fetch("https://api.fbi.gov/wanted/v1/list")
    .then((response) => response.json())
    .then((data) => {
      // get top 10?
      const topFugitives = data.items.slice(1, 11);

      //  box for each of the top 10 fugitives
      topFugitives.forEach((fugitive) => {
        createFugitiveBox(fugitive);
      });
    });

  function createFugitiveBox(fugitive) {
    var fugitiveBox = document.createElement("div");
    fugitiveBox.classList.add("fugitive-box");
    fugitiveBox.style.margin = "0";
    fugitiveBox.style.boxSizing = "border-box";
    fugitiveBox.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2)";
    fugitiveBox.style.backgroundColor = "whitesmoke";

    var name = document.createElement("h2");
    name.textContent = fugitive.title;

    var picture = document.createElement("img");
    picture.src = fugitive.images[0].original;
    picture.alt = "Fugitive Picture";
    picture.classList.add("fugitive-image");
    picture.style.objectFit = "cover";
    picture.style.objectPosition = "top";
    picture.style.height = "275px";

    var reward = document.createElement("p");
    if (fugitive.reward_text !== null) {
      reward.innerHTML = `<strong>Reward:</strong> ${fugitive.reward_text}`;
    } else {
      reward.innerHTML =
        "<strong>Call your local authorities for reward information</strong>";
    }

    var description = document.createElement("p");
    description.innerHTML = `<strong>Description:</strong> ${fugitive.description}`;

    var fieldOffice = document.createElement("p");
    if (fugitive.field_offices == null) {
      fieldOffice.innerHTML = `<strong>Field Office:</strong> N/A`;
    } else {
      fieldOffice.innerHTML = `<strong>Field Office:</strong> ${fugitive.field_offices}`;
    }

    var sex = document.createElement("p");
    if (fugitive.sex == null) {
      sex.innerHTML = `<strong>Sex:</strong> N/A`;
    } else {
      sex.innerHTML = `<strong>Sex:</strong> ${fugitive.sex}`;
    }
    var url = document.createElement("p");
    var link = document.createElement("a");
    link.href = fugitive.url;
    link.textContent = "More Information about this Suspect";
    url.appendChild(link);

    // Append to the fugitive box
    fugitiveBox.appendChild(name);
    fugitiveBox.appendChild(picture);
    fugitiveBox.appendChild(reward);
    fugitiveBox.appendChild(description);
    fugitiveBox.appendChild(fieldOffice);
    fugitiveBox.appendChild(sex);
    fugitiveBox.appendChild(url);

    // Append the fugitive box to the fugitive-info section
    document.getElementById("fugitive-info").appendChild(fugitiveBox);
  }
}
async function chartData() {
  raceOfFugitives = [];
  numberOfFugitives = [];
  await fetch("https://api.fbi.gov/wanted/v1/list")
    .then((response) => response.json())
    .then((data) => {
      // get top 10?
      // const race = data.items.race_raw;
      items = data.items;
      race_index = {};
      for (i = 0; i < items.length; i++) {
        if (items[i].race == null) {
          continue;
        }
        if (!race_index[items[i].race]) {
          console.log(!race_index[items[i].race]);
          console.log(items[i].race);
          race_index[items[i].race] = raceOfFugitives.length;
          raceOfFugitives.push(items[i].race);
          numberOfFugitives.push(0);
        }
        numberOfFugitives[race_index[items[i].race]] += 1;
        console.log(numberOfFugitives[race_index[items[i].race]]);
      }
    });
  chartDemographics(raceOfFugitives, numberOfFugitives);
}
function chartDemographics(raceOfFugitives, numberOfFugitives) {
  const ctx = document.getElementById("myChart");
  var chart = Chart.getChart("myChart");

  if (chart != undefined) {
    chart.destroy();
  }
  console.log(raceOfFugitives);
  console.log(numberOfFugitives);
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: raceOfFugitives,
      datasets: [
        {
          label: "Race of Suspects",
          data: numberOfFugitives,
        },
      ],
    },
  });
}
window.onload = getData;
