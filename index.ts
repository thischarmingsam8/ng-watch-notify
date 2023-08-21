import { createBuilder, BuilderContext, targetFromTargetString } from '@angular-devkit/architect';
import { executeBrowserBuilder } from '@angular-devkit/build-angular';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const notifier = require('node-notifier');
const path = require('path');

async function devBuildWithNotification(
  options: any,
  context: BuilderContext
): Promise<any> {
  let projectName = context.target!.project;

  const sourceTarget = targetFromTargetString(context.target!.project + ':build');
  let buildOptions = await context.getTargetOptions(sourceTarget);

  //buildOptions.logging = { level: 'debug' };
  buildOptions.watch = options.watch || true;

  context.target!.configuration = options.configuration || 'development';

  const notificationParams = {
    appName: ' ', // HACK: Text here looks janky on windows
    title: projectName,
    icon: path.join(__dirname, 'image.png'),
    message: ''
  };

  return (executeBrowserBuilder(buildOptions as any, context) as any).pipe(
    tap((buildResult: any) => {
      let message = buildResult.success ? 'Build successful' : 'Build FAILED';

      notifier.notify({ ...notificationParams, message });
    }),
    catchError(error => {
      notifier.notify({ ...notificationParams, message: 'Build ERROR' });
      console.error('Error occurred:', error);
      return of({ success: false });
    })
  );
}

export default createBuilder(devBuildWithNotification);
