<template>
  <div>
    <p class="title">Aulas Remotas</p>

    <div v-if="courses.length">
      <v-expansion-panels>
        <v-expansion-panel v-for="course in courses" :key="course.id">
          <v-expansion-panel-header>
            {{ course.name }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div v-if="course.recordings">
              <v-list-item
                two-line
                v-for="recording in course.recordings"
                :key="recording.id"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ recording.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    recording.startTime.getMonth
                  }}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-icon>
                  <v-btn
                    @click.native="downloadURI(recording.url, recording.name)"
                    color="primary"
                    elevation="1"
                    large
                  >
                    <v-icon>mdi-download</v-icon>
                    {{ recording.size.toStringBytes(0) }}
                  </v-btn>
                </v-list-item-icon>
              </v-list-item>
            </div>

            <div v-else>
              <v-progress-linear indeterminate></v-progress-linear>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div v-else>
      <v-card>
        <v-card-text>
          Carregando Cursos
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import Course from "@/models/course.model";
import Recording from "@/models/recording.model";
import "@/extensions/number.extension";

@Component
export default class Dashboard extends Vue {
  courses: Array<Course> = [];

  mounted(): void {
    if (this.courses.length > 0) {
      return;
    }
    axios
      .get("https://trbuhwp12h.execute-api.sa-east-1.amazonaws.com/courses")
      .then((res) => {
        var courses: Array<Course> = res.data;
        courses = res.data.sort((c1: Course, c2: Course) =>
          c2.name > c1.name ? -1 : 1
        );

        this.courses = courses;

        courses.forEach((course) => {
          this.recordingsFor(course.id);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  recordingsFor(courseId: string): void {
    const index = this.courses.findIndex((c) => c.id == courseId);
    console.log(index);
    axios
      .get(
        `https://trbuhwp12h.execute-api.sa-east-1.amazonaws.com/courses/${courseId}/class-recordings`
      )
      .then((res) => {
        var course = this.courses[index];
        console.log(course);
        var recordings: Array<Recording> = res.data;
        recordings = recordings.sort((r1, r2) =>
          r2.startTime > r1.startTime ? 1 : -1
        );
        course.recordings = recordings;
        Vue.set(this.courses, index, course);
        console.log("foi", course.name);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  downloadURI(uri: string, name: string): void {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
</script>
