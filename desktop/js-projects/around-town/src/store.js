import Vue from "vue";
import Vuex from "vuex";
import EventService from "@/services/EventService.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: { id: "978", name: "Michael Hicks" },
    categories: ["nature", "education", "pets", "community", "food"],
    totalEvents: 0,
    event: {},
    events: [],
    loggedinStatus: false
  },
  mutations: {
    ADD_EVENT(state, event) {
      state.events.push(event);
    },
    SET_EVENTS(state, events) {
      state.events = events;
    },
    SET_TOTAL_EVENTS(state, totalEvents) {
      state.totalEvents = totalEvents;
    },
    SET_EVENT(state, event) {
      state.event = event;
    }
  },
  actions: {
    createEvent({ commit }, event) {
      return EventService.postEvent(event).then(() => {
        commit("ADD_EVENT", event);
      });
    },
    fetchEvents({ commit }, { perPage, page }) {
      EventService.getEvents(perPage, page)
        .then(response => {
          commit("SET_TOTAL_EVENTS", 
          parseInt(response.headers["x-total-count"])
          );
          commit("SET_EVENTS", response.data);
        })
        .catch(error => {
          console.log("There was an error:" + error.response);
        });
    },
    fetchEvent({ commit, getters }, id) {
      var event = getters.getEventById(id);

      if (event) {
        commit("SET_EVENT", event);
      } else {
        EventService.getEvent(id)
          .then(response => {
            commit("SET_EVENT", response.data);
          })
          .catch(error => {
            console.log('There was an error:', error.response);
          });
      }
    }
  },
  getters: {
    getEventById: state => id => {
      return state.events.find(event => event.id === id);
    },
    catLength: state => {
      return state.categories.length;
    }
  }
});
