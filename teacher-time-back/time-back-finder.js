(() => {
  const finder = document.querySelector("#finder");
  if (!finder) return;
  const steps = [...finder.querySelectorAll("[data-finder-step]")];
  const progress = [...finder.querySelectorAll(".finder-progress span")];
  const prev = finder.querySelector("[data-finder-prev]");
  const next = finder.querySelector("[data-finder-next]");
  const state = { step: 0, lane: "", approval: "", frequency: "", minutes: "", output: "", purpose: "" };
  const lanes = {
    reuse:{name:"Reuse Planner",mark:"RP",job:"Turn an approved, teacher-owned lesson or unit outline into an editable structure.",sources:"Blank templates, teacher-written objectives, approved unit outlines, public facts, and fictional material.",never:"Student records, identifiers, identifiable work, grades, rosters, behavior, health, disability, family, or confidential information."},
    family:{name:"Family Message Drafter",mark:"FM",job:"Turn approved public logistics and a neutral brief into an editable general family update.",sources:"Public dates, approved event details, neutral logistics, and a teacher-written tone brief.",never:"Student-specific communication, attendance, grades, behavior, family records, or other identifying details."},
    meetings:{name:"Meeting-to-Action Assistant",mark:"MA",job:"Turn neutral or properly de-identified meeting notes into an editable action list and next agenda.",sources:"Neutral agenda, approved non-sensitive notes, public deadlines, and named role categories.",never:"Student cases, personnel matters, confidential decisions, private records, or identifying combinations."},
    library:{name:"Teaching Library Organizer",mark:"TL",job:"Turn approved, teacher-owned materials into a reusable map of files, tags, and next-use ideas.",sources:"Teacher-owned files with student information removed, blank templates, and approved curriculum material.",never:"Student submissions, rosters, grades, accommodations, or private school records."},
    feedback:{name:"Feedback Framework Builder",mark:"FF",job:"Create an editable rubric structure, comment bank, and neutral feedback stems without evaluating a student.",sources:"Approved criteria, standards supplied by the teacher, blank rubrics, and fictional examples.",never:"Identifiable student work, grades, disability information, automated scoring, or final student-level judgments."},
    unsafe:{name:"This task needs a safer route",mark:"!",job:"Student-level grading, plans, behavior, and records do not fit this first-assistant method.",sources:"Use fictional examples and approved criteria only if you reroute to a feedback-framework or planning task.",never:"Do not enter or process the student-level information described in the original task."}
  };

  function validStep(){
    if(state.step===0) return Boolean(state.lane);
    if(state.step===1) return Boolean(document.querySelector('#finderFrequency').value.trim() && document.querySelector('#finderMinutes').value.trim() && document.querySelector('#finderOutput').value.trim());
    if(state.step===2) return Boolean(state.approval);
    return true;
  }
  function showStep(index){
    state.step=Math.max(0,Math.min(index,steps.length-1));
    steps.forEach((step,i)=>step.hidden=i!==state.step);
    progress.forEach((item,i)=>item.classList.toggle('is-current',i===state.step));
    prev.disabled=state.step===0;
    next.hidden=state.step===steps.length-1;
    next.disabled=!validStep();
    next.textContent=state.step===2?'Build my blueprint':'Continue';
    if(state.step===3) renderResult();
  }
  finder.querySelectorAll('[data-finder-choice]').forEach(button=>button.addEventListener('click',()=>{
    finder.querySelectorAll('[data-finder-choice]').forEach(item=>item.classList.remove('is-selected'));
    button.classList.add('is-selected'); state.lane=button.dataset.finderChoice; next.disabled=false;
  }));
  finder.querySelectorAll('[data-approval]').forEach(button=>button.addEventListener('click',()=>{
    finder.querySelectorAll('[data-approval]').forEach(item=>item.classList.remove('is-selected'));
    button.classList.add('is-selected'); state.approval=button.dataset.approval; next.disabled=false;
  }));
  finder.querySelectorAll('input').forEach(input=>input.addEventListener('input',()=>{ next.disabled=!validStep(); }));
  prev.addEventListener('click',()=>showStep(state.step-1));
  next.addEventListener('click',()=>{
    if(!validStep()) return;
    if(state.step===1){ state.frequency=document.querySelector('#finderFrequency').value.trim();state.minutes=document.querySelector('#finderMinutes').value.trim();state.output=document.querySelector('#finderOutput').value.trim();state.purpose=document.querySelector('#finderPurpose').value.trim(); }
    showStep(state.step+1);
  });
  function escapeHtml(value){return String(value||'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[char]));}
  function renderResult(){
    const lane=lanes[state.lane]; const planning=state.approval==='no'; const unsafe=state.lane==='unsafe';
    const instruction=unsafe
      ? 'Stop here. This assistant is not the place for student or confidential records. Choose a different, student-neutral task or reroute to a feedback framework using only approved criteria and fictional examples.'
      : `You are my ${lane.name}. Your only job is to ${lane.job.charAt(0).toLowerCase()+lane.job.slice(1)}\n\nUse only ${lane.sources} Return ${state.output||'the exact editable structure I request'}. Do not assume facts that are not present.\n\nNever request or use student records, direct or indirect identifiers, identifiable student work, grades, attendance, behavior, health, disability, counseling, family, personnel, or confidential information. If the request appears to contain those details, stop and ask for blank, public, fictional, or student-neutral replacement material and direct me to school guidance.\n\nYou may draft and organize. I make every instructional, evaluative, communication, and final-use decision. End with: Teacher review required: check accuracy, bias, appropriateness, and alignment before use.`;
    document.querySelector('#finderResult').innerHTML=`<div class="result-head"><div class="result-mark">${lane.mark}</div><div><small>${unsafe?'SAFER ROUTE':'YOUR FIRST ASSISTANT'}</small><h2>${lane.name}</h2></div></div>${planning&&!unsafe?'<div class="privacy-banner"><strong>Planning mode only.</strong> Leadership has not yet named the approved tool and account. Complete the blueprint on paper, use fictional material, and do not create a workaround account.</div>':''}<div class="result-grid"><div class="result-card"><span>ONE JOB</span><strong>${escapeHtml(lane.job)}</strong><p>Frequency: ${escapeHtml(state.frequency||'not entered')} | Current time: ${escapeHtml(state.minutes||'?')} minutes</p></div><div class="result-card"><span>APPROVED SOURCES</span><strong>Keep inputs student-neutral</strong><p>${escapeHtml(lane.sources)}</p></div><div class="result-card"><span>NEVER USE</span><strong>Keep the boundary visible</strong><p>${escapeHtml(lane.never)}</p></div><div class="result-card"><span>TWO-WEEK DECISION</span><strong>Keep, revise, or stop</strong><p>Measure time with the assistant, correction time, usefulness, and safety slips. ${state.purpose?`Time-back purpose: ${escapeHtml(state.purpose)}.`:''}</p></div></div><div class="instruction-box" id="instructionBox">${escapeHtml(instruction)}</div><div class="result-actions"><button class="finder-button primary" type="button" data-print>Print or save PDF</button><button class="finder-button" type="button" data-copy>Copy instructions</button><button class="finder-button" type="button" data-restart>Start again</button></div><p class="finder-note" id="copyStatus" aria-live="polite">Review school guidance before live use. This finder does not certify approval or compliance.</p>`;
    document.querySelector('[data-print]').addEventListener('click',()=>window.print());
    document.querySelector('[data-copy]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(instruction);document.querySelector('#copyStatus').textContent='Instructions copied. Review them and school guidance before use.';}catch{document.querySelector('#copyStatus').textContent='Copy was blocked by the browser. Select the instruction text manually.';}});
    document.querySelector('[data-restart]').addEventListener('click',()=>location.reload());
  }
  showStep(0);
})();
