/*!
 * EngressProxy Interface
 * 
 * Copyright (c) 1984-2024 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 *
 * Date: 2024-10-03
 */

package com.coronadofactory.mesh;

public interface EngressProxy {

	public Service getService(String service);
	public Object getServiceBroker(String service) throws Exception;


}
