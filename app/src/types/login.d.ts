export interface Device_info {
  device_id: string;
  client_os: string;
  client_system: string;
  app_client_version: string;
  network_type: string;
}

export interface loginBySMSParams {
  channel_id: number;
  source: string;
  social_type: number;
  unique_id: string;
  phone: string;
  sms_code: string;
  agree: boolean;
  client_type: string;
  device_info: Device_info;
}
