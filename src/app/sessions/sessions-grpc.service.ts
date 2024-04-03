import { ListSessionsRequest, SessionRawEnumField, SessionsClient, SortDirection } from "@aneoconsultingfr/armonik.api.angular";
import { Injectable, inject } from "@angular/core";

@Injectable()
export class SessionGrpcService {
  service = inject(SessionsClient);

  list$() {
    const request = new ListSessionsRequest({
      page: 0,
      filters: { },
      pageSize: 10,
      sort: {
        direction: SortDirection.SORT_DIRECTION_ASC,
        field: {
          sessionRawField: {
            field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT
          }
        }
      }
    });
    return this.service.listSessions(request);
  }
}