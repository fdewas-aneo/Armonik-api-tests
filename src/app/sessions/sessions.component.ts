import { AgGridAngular } from "@ag-grid-community/angular";
import { Component, OnInit, inject } from "@angular/core";
import { SessionGrpcService } from "./sessions-grpc.service";
import { SessionRaw, SessionRawEnumField } from "@aneoconsultingfr/armonik.api.angular";
import { ColDef, ColGroupDef, Column } from "ag-grid-community";
import { Subject, switchMap } from "rxjs";

@Component({
  selector: "app-sessions",
  standalone: true,
  templateUrl: 'sessions.component.html',
  imports: [
    AgGridAngular,
  ],
  providers: [
    SessionGrpcService
  ]
})
export class SessionsComponent implements OnInit {

  grpcService = inject(SessionGrpcService);

  refresh = new Subject<void>();

  ngOnInit(): void {
    this.refresh.pipe(
      switchMap(() => this.grpcService.list$())
    ).subscribe((data) => {
      if (data.sessions) {
        this.row = data.sessions;
      }
    });

  }

  onClick() {
    this.refresh.next();
  }

  columnDefs: any = [
    { headerName: 'SessionId', field: 'sessionId' },
    { headerName: 'Created At', field: 'createdAt', valueFormatter: (p: any) => p.data?.createdAt?.seconds ?? '-' },
    { headerName: 'Options', field: 'options', cellDataType: 'object', },
    { headerName: 'Status', field: 'status' },
    { headerName: 'Application Name', field: 'options.applicationName' },
    { headerName: 'Application Version', field: 'options.applicationVersion' },
  ];

  row: SessionRaw.AsObject[] = [];
}