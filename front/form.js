/*!
 * Form Helper
 * 
 * Copyright (c) 1984-2024 Jose Garcia
 * Released under the MIT license
 * https://raw.githubusercontent.com/coronadofactory/hexagonal/refs/heads/main/LICENSE.txt
 *
 * Date: 2024-10-03
 */

export function inputChange(e, setStatus, setError) {

  setError(null);

  const form = e.target.form, requires = form.querySelectorAll("[required]");

  for (const item of requires) {
      if (item.value.trim()==='') {
        setStatus('empty');
        return;
      }  
  }

  setStatus('typing')
  return;

} 

export function submitForm(e, setStatus, setError, submitter) {

  e.preventDefault();
  
  var err;
  if (submitter.Validator && (err=validate(e.target, submitter.Validator))) {
      setStatus('typing');
      setError(err);
      return;
  }

  setStatus('submitting');
  setError(null);

  if (submitter.put) {
    submitter.put(serialize(e.target))
    return;
  }

  submitter.invoke(serialize(e.target))
  .then(
    
  function(data) {
    setStatus('empty');
    if (submitter.statuses && submitter.statuses.setData) submitter.statuses.setData(data);
  },
  function(err) {
    setStatus('typing');
    setError(err);
  });


}

function validate(form, Validator) {

  const inputs = form.querySelectorAll("input,select");

  for (const item of inputs) {

    if (Validator[item.name]) {
      for (const ex of Validator[item.name]) {
        if (!ex.r.test(item.value.trim())) {
          return new Error(ex.m)
        }
      }
    }
    
    return null;

  }

  return null;

}

function serialize(form) {

  const inputs = form.querySelectorAll("input[type=text],input[type=hidden],select");
  const checkboxs = form.querySelectorAll("input[type=checkbox]:checked");
  var json = {};

  for (const item of inputs) {
    json[item.name]=item.value.trim();
  }

  for (const item of checkboxs) {
    json[item.name]=item.value.trim();
  }

  return json;

}