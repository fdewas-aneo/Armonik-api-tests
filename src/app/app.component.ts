
import { Component, OnInit } from "@angular/core";
import { GrpcService } from "./grpc.service";
import { AsyncPipe, NgFor, NgIf } from "@angular/common";
import { ApplicationRaw } from "@aneoconsultingfr/armonik.api.angular";
import { Subject, catchError, interval, map, merge, startWith, switchMap } from "rxjs";
import { SessionsComponent } from "./sessions/sessions.component";

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [
    GrpcService
  ],
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    SessionsComponent,
  ]
})
export class AppComponent implements OnInit {
  data: ApplicationRaw[] = [];
  oldData: ApplicationRaw[] = [];
  nErrors = 0;
  nCalls = 0;
  detected: boolean = false;
  
  interval$ = interval(1000);
  refresh$ = new Subject<void>();

  constructor(
    private _service: GrpcService
  ) { }

  ngOnInit(): void {
    merge(this.refresh$).pipe(
      startWith(),
      switchMap(() => {
        return this._service.getData()
      }),
      map(data => {
        return data.applications ?? []
      }),
      catchError(e => {
        console.error('Error catched: ', e);
        return [];
      })
    ).subscribe(data => {
      this.nCalls += 1;
      this.oldData = []
      
      this.data.forEach(l => {
        this.oldData.push(l);
      })
      
      this.data = data;
      
      this.compareData();
    })
  }

  compareData() {
    if (this.data !== undefined && this.oldData.length !== 0) {
      for (let i=0; i<this.data.length; i++) {
        if (!this.compareApplicationLines(this.oldData[i], this.data[i])) {
          this.nErrors += 0.5;
          this.detected = true;
        } else {
          this.detected = false;
        }
      }
    }
  }

  compareApplicationLines(line1: ApplicationRaw, line2: ApplicationRaw) {
    return line1.name === line2.name && line1.namespace === line2.namespace && line1.version === line2.version && line1.service === line2.service;
  }

  refresh() {
    this.refresh$.next();
  }
}