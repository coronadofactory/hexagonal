package com.coronadofactory.mesh;

import com.coronadofactory.cqrs.queries.ProxyException;

public interface IngressProxy {

	public Object handler(String service, Object event, Object context) throws ProxyException;


}
