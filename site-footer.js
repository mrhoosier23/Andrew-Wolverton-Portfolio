/* Shared contact forms. School-specific forms keep their existing handler. */
(function () {
'use strict';
document.querySelectorAll('[data-footer-year]').forEach(function(n){n.textContent=new Date().getFullYear();});
var form=document.querySelector('[data-site-contact-form]');
if(!form||form.dataset.contactReady)return;
form.dataset.contactReady='true';
var note=form.querySelector('#contactFormNote'),submit=form.querySelector('button[type="submit"]'),type=form.querySelector('[name="projectType"]');
document.querySelectorAll('[data-service-choice]').forEach(function(link){link.addEventListener('click',function(){if(type)type.value=link.dataset.serviceChoice||'';});});
var sticky=document.querySelector('.sticky-contact');
if(sticky&&'IntersectionObserver' in window){new IntersectionObserver(function(entries){sticky.hidden=entries[0].isIntersecting;},{threshold:0}).observe(form.closest('[data-site-contact]'));}
form.addEventListener('submit',async function(event){
 event.preventDefault();
 if(submit.disabled||!form.reportValidity()||form.querySelector('[name="_honey"]').value)return;
 var label=submit.textContent,controller=new AbortController(),timeout=setTimeout(function(){controller.abort();},30000);
 submit.disabled=true;submit.textContent='Sending...';form.setAttribute('aria-busy','true');note.classList.remove('is-error','is-success');note.textContent='Sending your message...';
 try{
  var response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'},signal:controller.signal});
  var result=await response.json();
  if(!response.ok||result.success===false||result.success==='false')throw new Error('Submission failed');
  form.reset();note.classList.add('is-success');note.textContent='Thanks. Your message has been sent to Andrew.';
 }catch(error){
  note.classList.add('is-error');note.textContent='The form did not send. Email ';
  var email=document.createElement('a');email.href='mailto:hello@awolverton.com';email.textContent='hello@awolverton.com';note.append(email,' directly.');
 }finally{clearTimeout(timeout);submit.disabled=false;submit.textContent=label;form.removeAttribute('aria-busy');}
});
}());
