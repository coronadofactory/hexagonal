/*!
 * Uploader APIGateway
 * 
 * Copyright (c) 1984-2024 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 *
 * Date: 2024-10-10
 */

@Controller
public class APIGateway {

	@Autowired
	private APIServer apiServer;
	
	private Logger logger = LoggerFactory.getLogger(APIGatewayMMC.class);

	// Multipart log
	private String getUriFile(String app, String service) {
		return "/apigateway/"+app+"/file/"+service;
	}

	// Multipart ingress

	@RequestMapping(value = "/apigateway/{app}/file/{service}", method = RequestMethod.POST)
	public ResponseEntity<String> file(@PathVariable("app") String app, @PathVariable("service") String service, @RequestParam("body") String body, @RequestParam("upl") MultipartFile file, HttpServletRequest http, HttpServletResponse httpResponse) {
		try {
			API api = apiServer.getAPIFile(http, app, file);
			api.init(http, getUriFile(app, label, service));
			Object response = api.invoke(service, body.getBytes());
			api.dispatch(response, httpResponse);
		} catch (FrontException e) {
			return throwError(e);
		}

		return null;

	}

    // Throw error management
    private ResponseEntity<String> throwError(FrontException e) {
		return e.getResponseEntity();
	}


}
