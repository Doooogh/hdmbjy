package org.fh.controller.act.util;

import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.TaskListener;
import org.apache.shiro.session.Session;
import org.fh.util.Jurisdiction;

/**
 * 说明：指定下一任务待办人
 * 作者：FH Admin fh313596790qq(青苔)
 * 官网：www.fhadmin.org
 */
@SuppressWarnings("serial")
public class ManagerTaskHandler implements TaskListener {

	@Override
	public void notify(DelegateTask delegateTask) {
		Session session = Jurisdiction.getSession();
		session.setAttribute("TASKID", delegateTask.getId());			//任务ID
		session.setAttribute("YAssignee", delegateTask.getAssignee());	//默认待办人
	}

}

