/*!
 * IngressProxy Interface
 * 
 * Copyright (c) 1984-2024 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 *
 * Date: 2024-10-03
 */

package com.coronadofactory.mesh;

import com.coronadofactory.cqrs.queries.ProxyException;

public interface IngressProxy {

	public Object handler(String service, Object event, Object context) throws ProxyException;


}
