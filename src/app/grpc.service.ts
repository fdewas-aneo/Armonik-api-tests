import { Injectable, inject } from "@angular/core";
import { ApplicationRawEnumField, ApplicationsClient, ListApplicationsRequest, SortDirection } from "@aneoconsultingfr/armonik.api.angular";

@Injectable()
export class GrpcService {
  service = inject(ApplicationsClient);

  getData() {
    const request = new ListApplicationsRequest({
      page: 0,
      filters: { },
      pageSize: 10,
      sort: {
        direction: SortDirection.SORT_DIRECTION_ASC,
        fields: [{
          applicationField: {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME
          }
        }]
      }
    })
    return this.service.listApplications(request)
  }
} 