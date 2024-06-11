// A user enters the website and finds a list of the names, dates, times, locations,
// and descriptions of all the parties that are happening.
// Next to each party in the list is a delete button. The user clicks the delete button
// for one of the parties. That party is then removed from the list.
// There is also a form that allows the user to enter information about a new party that
//they want to schedule. After filling out the form and submitting it, the user observes
//their party added to the list of parties.
// Frankie Milner Fullstack

const COHORT = "2405-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  event: [],
};

const eventList = document.querySelector("#event-list");
const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);

async function render() {
  await getEvent();
  renderEvent();
}
render();

async function getEvent() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.event = json.data;
  } catch (error) {
    console.error(error);
  }
}

function renderEvent() {
  if (!state.event.length) {
    eventList.innerHTML = "<li>No Events on your Calendar! Loser!</li>";
    return;
  }

  const eventCards = state.event.map((event) => {
    const card = document.createElement("div");
    card.className = "card mb-3";
    card.innerHTML = `
          <h2>${event.name}</h2>
          <p>${event.date}</p>
          <p>${event.time}</p>
          <p>${event.location}</p>
          <p>${event.description}</p>
          <button class="btn btn-danger" onclick="deleteEvent('${event.id}')">Delete</button>
        </div>
    `;
    return card;
  });

  eventList.replaceChildren(...eventCards);
}

async function addEvent(event) {
  event.preventDefault();

  const eventData = {
    name: document.getElementById("name").value,
    date: new Date(
      document.getElementById("date").value +
        "T" +
        document.getElementById("time").value
    ).toISOString(),
    location: document.getElementById("location").value,
    description: document.getElementById("description").value,
    cohortId: 219,
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventData),
    });

    const responseData = await response.json();
    console.log("Response data:", responseData);

    if (!response.ok) {
      throw new Error(
        responseData.error
          ? responseData.error.message
          : "Failed to add this event!"
      );
    }
    render();
  } catch (error) {
    console.error("Error", error);
  }
}

async function deleteEvent(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to remove this event! Sorry!");
    }

    render();
  } catch (error) {
    console.error("Error", error);
  }
}
